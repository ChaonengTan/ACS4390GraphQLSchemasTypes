// import
const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require('graphql')
// mockDB
const petList = require('./petList.json')
const gameData = require('./gameData.json')

// schema
const schema = buildSchema(`
    type About {
        message: String!
    }
    type Meal {
        description: String!
    }
    enum MealTime {
        breakfast
        lunch 
        dinner
    }
    type Pet {
        name: String!
        species: String!
    }
    type Game {
        index: Int!
        game: String!
        score: Int!
        leaderboard: String!
        gamers: String!
        comp_perc: String!
        rating: String!
        url: String!
        min_comp_time: String!
        max_comp_time: String!
    }
    enum TimeSettings {
        hours
        minutes
        seconds
    }
    type Time {
        time: Int
    }
    type Number {
        number: Int
    }
    type Query {
        getAbout: About
        getMeal(time: MealTime!): Meal
        getPet(id: Int!): Pet
        allPets: [Pet!]! 
        getGame(index: Int!): Game
        allGames: [Game!]!
        firstGame: Game
        lastGame: Game
        getTime(type: TimeSettings!): Time
        getRandom(range: Int!): Number
    }
`)

// resolver
const root = {
    getAbout: () => {
        return { message: 'Hello World' }
    },
    getMeal: ({ time }) => {
        const allMeals = { breakfast: 'toast', lunch: 'noodles', dinner: 'pizza' }
        const meal = allMeals[time]
		return { description: meal }
	},
    getPet: ({ id }) => {	
		return petList[id]
	},
	allPets: () => {	
		return petList
	},
    getGame: ({ index }) => {
        return gameData[index]
    },
    allGames: () => {
        return gameData
    },
    firstGame: () => {
        return gameData[0]
    },
    lastGame: () => {
        return gameData[gameData.length-1]
    },
    getTime: ({ type }) => {
        const date = new Date()
        const allTypes = { hours: date.getHours(), minutes: date.getMinutes(), seconds: date.getSeconds() }
        return { time: allTypes[type] }
    },
    getRandom: ({ range }) => {
        return { number: Math.floor(Math.random() * range) }
    }
}

// app
const app = express()

app.use('/graphql', graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true
}))

const port = 4000
app.listen(port, () => {
    console.log(`Running on port: ${port}`)
    console.log(`http://localhost:4000/graphql`)
})