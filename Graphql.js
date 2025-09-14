// import { ApolloServer } from "@apollo/server";
// import { startStandaloneServer } from "@apollo/server/standalone";
// import connection from "./DB.js";
// import { typeDefs } from "./Scehme.js";  // make sure Schema file is exporting correctly

// const resolvers = {
//   Query: {
//     Games: async () => {
//       try {
//         const pool = await connection();
//         const result = await pool.request().query("SELECT TOP 10 * FROM dbo.Game");

//         return result.recordset.map((g) => ({
//           ...g,
//           platform: g.platform ? g.platform.split(",") : [],
//         }));
//       } catch (error) {
//         console.error(`❌ Games resolver error: ${error.message}`);
//         throw error;
//       }
//     },
//     Game:async(_,{id})=>{
//         try {
//            const pool=await connection()
//            const result=await pool.request()
//            .input("id",id)
//            .query(`select top 10 *from dbo.Game as g where g.id=@id`)
//            if(result.recordset.length===0)return null
//            const g=result.recordset[0]
//            return {
//             ...g,
//             platform:g.platform?g.platform.split(","):[]
//            }
//         } catch (error) {
//            console.error(`something went wrong ${error}`)
//         }
//     },
//     Books: async () => {
//       try {
//         const pool = await connection();
//         const result = await pool.request().query("select top 10 * from dbo.Books");
//         return result.recordset;
//       } catch (error) {
//         console.error(`❌ Books resolver error: ${error.message}`);
//         throw error;
//       }
//     },
//     //  Book:async(_,{Price})=>{
//     //     try {
//     //         const pool =await connection()
//     //         const result=await pool.request()
//     //         .input("Price",Price)
//     //         .query(`select  * from dbo.Books as b where b.Price=@Price`)
//     //         return result.recordset
//     //     } catch (error) {
//     //         console.error(`something went wrong ${error}`)
//     //     }
//     //  }
//    Book: {
//     games: async (parent) => {
//       try {
//         const pool = await connection();
//         const result = await pool
//           .request()
//           .input("bookId", sql.Int, parent.id)
//           .query(`
//             SELECT g.*
//             FROM dbo.Game g
//             INNER JOIN dbo.BookGame bg ON g.id = bg.GameId
//             WHERE bg.BookId = @bookId
//           `);

//         return result.recordset.map((g) => ({
//           ...g,
//           platform: g.platform ? g.platform.split(",") : [],
//         }));
//       } catch (error) {
//         console.error(`❌ Book.games resolver error: ${error.message}`);
//         throw error;
//       }
//     },
//   },

//   },
// };

// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
// });

// const { url } = await startStandaloneServer(server, {
//   listen: { port: 4000 },
// });

// console.log(`🚀 Your GraphQL server is running at ${url}`);

import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import connection from "./DB.js";
import { typeDefs } from "./Scehme.js";
import sql from "mssql"; // 👈 important for .input types

const resolvers = {
  Query: {
    Games: async () => {
      try {
        const pool = await connection();
        const result = await pool
          .request()
          .query("SELECT TOP 10 * FROM dbo.Game");

        return result.recordset.map((g) => ({
          ...g,
          platform: g.platform ? g.platform.split(",") : [],
        }));
      } catch (error) {
        console.error(`❌ Games resolver error: ${error.message}`);
        throw error;
      }
    },

    Game: async (_, { id }) => {
      try {
        const pool = await connection();
        const result = await pool
          .request()
          .input("id", sql.Int, id)
          .query(`SELECT * FROM dbo.Game WHERE id=@id`);

        if (result.recordset.length === 0) return null;
        const g = result.recordset[0];
        return {
          ...g,
          platform: g.platform ? g.platform.split(",") : [],
        };
      } catch (error) {
        console.error(`something went wrong ${error}`);
        throw error;
      }
    },

    Books: async () => {
      try {
        const pool = await connection();
        const result = await pool
          .request()
          .query("SELECT TOP 10 * FROM dbo.Books");
        return result.recordset;
      } catch (error) {
        console.error(`❌ Books resolver error: ${error.message}`);
        throw error;
      }
    },

    Book: async (_, { Price }) => {
      try {
        const pool = await connection();
        const result = await pool
          .request()
          .input("Price", sql.Int, Price)
          .query("SELECT * FROM dbo.Books WHERE Price=@Price");

        return result.recordset;
      } catch (error) {
        console.error(`something went wrong ${error}`);
        throw error;
      }
    },
  },

  // ✅ Move relation resolvers here (outside Query)
  Book: {
    games: async (parent) => {
      try {
        const pool = await connection();
        const result = await pool.request().input("BookId", sql.Int, parent.id) // 👈 use Book's id
          .query(`
          SELECT g.id AS GameId, g.title, g.platform
          FROM dbo.Game g
          INNER JOIN dbo.BookGame bg ON g.id = bg.GameId
          WHERE bg.BookId = @BookId
        `);

        return result.recordset.map((g) => ({
          id: g.GameId, // 👈 avoid duplicate id arrays
          title: g.title,
          platform: g.platform ? g.platform.split(",") : [],
        }));
      } catch (error) {
        console.error(`❌ Book.games resolver error: ${error.message}`);
        throw error;
      }
    },
  },
  Mutation: {
// DeleteGame: async (_, { id }) => {
//       try {
//         const pool = await connection();
//         const result = await pool
//           .request()
//           .input("id", sql.Int, parseInt(id, 10))
//           .query("DELETE FROM dbo.Game WHERE id=@id");

//         return result.rowsAffected[0] > 0;
//       } catch (error) {
//         console.error(`❌ DeleteGame error: ${error}`);
//         return false;
//       }

//   },
DeleteGame: async (_, { id }) => {
  try {
    const pool = await connection();

    // first fetch game
    const gameResult = await pool
      .request()
      .input("id", sql.Int, parseInt(id, 10))
      .query("SELECT * FROM dbo.Game WHERE id=@id");

    if (gameResult.recordset.length === 0) return null;
    const gameToDelete = gameResult.recordset[0];

    // delete
    await pool.request()
      .input("id", sql.Int, parseInt(id, 10))
      .query("DELETE FROM dbo.Game WHERE id=@id");

    // return deleted game
    return {
      ...gameToDelete,
      platform: gameToDelete.platform
        ? gameToDelete.platform.split(",")
        : [],
    };
  } catch (error) {
    console.error(`❌ DeleteGame error: ${error}`);
    throw error;
  }
},

addBook: async (_, { Author, Price, Rating, Verified, GameID }) => {
  try {
    const pool = await connection();

    const result = await pool.request()
      .input("Author", sql.VarChar, Author)
      .input("Price", sql.Int, Price)
      .input("Rating", sql.Int, Rating)
      .input("Verified", sql.Bit, Verified ? 1 : 0)
      .input("GameID", sql.Int, GameID || null)
      .query(`
        INSERT INTO dbo.Books (Author, Price, Rating, Verified, GameID)
        OUTPUT INSERTED.*
        VALUES (@Author, @Price, @Rating, @Verified, @GameID)
      `);

    return result.recordset[0]; // return the newly inserted book
  } catch (error) {
    console.error(`❌ addBook error: ${error}`);
    throw error;
  }
},
UpdateBook: async (_, { id, Author, Price, Rating, Verified, GameID }) => {
  try {
    const pool = await connection();

    const result = await pool.request()
      .input("id", sql.Int, parseInt(id, 10))
      .input("Author", sql.VarChar, Author)
      .input("Price", sql.Int, Price)
      .input("Rating", sql.Int, Rating)
      .input("Verified", sql.Bit, Verified ? 1 : 0)
      .input("GameID", sql.Int, GameID || null)
      .query(`
        UPDATE dbo.Books
        SET 
          Author = @Author,
          Price = @Price,
          Rating = @Rating,
          Verified = @Verified,
          GameID = @GameID
        OUTPUT INSERTED.*
        WHERE id = @id
      `);

    if (result.recordset.length === 0) return null; // nothing updated

    return result.recordset[0]; // return updated book
  } catch (error) {
    console.error(`❌ UpdateBook error: ${error}`);
    throw error;
  }
}


}
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀 Your GraphQL server is running at ${url}`);
