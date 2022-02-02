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
    type Dice {
        total: Int!
        sides: Int!
        rolls: [Int!]
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
        getRandom(range: Int!): Int
        getRolls(sides: Int!, rolls: Int!): Dice
        getGameCount: Int
        gamesInRange(start: Int!, count: Int!): [Game!]!
        getGameByLeaderboardScore(score: String!): [Game!]
        allUrl: [String!]!
    }
    type Mutation {
        updatePet(id: Int!, name: String, species: String): Pet
        deletePet(id: Int!): Pet
        createPet(name: String!, species: String!): Pet
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
        return Math.floor(Math.random() * range)
    },
    getRolls: ({ sides, rolls }) => {
        const roll = []
        for (let i=0; i<rolls; i++) {
            roll.push(Math.floor(Math.random()*(sides))+1)
        }
        return { total: roll.reduce((a, b) => a + b, 0), sides: sides, rolls: roll }
    },
    getGameCount: () => {
        return gameData.length
    },
    gamesInRange: ({ start, count }) => {
        return gameData.slice(start, start+count)
    },
    getGameByLeaderboardScore: ({ score }) => {
        return gameData.filter(data => data.leaderboard == score)
    },
    allUrl: () => {
        return gameData.map(data => data.url)
    },
    updatePet: ({ id, name, species }) => {
        const pet = petList[id]
        if (pet === undefined) {
          return null 
        }
        pet.name = name || pet.name 
        pet.species = species || pet.species
        return pet
    },
    deletePet: ({ id }) => {
        if (petList[id] === undefined) {
            return null 
        }
        const rem = petList[id]
        petList.splice(id, 1)
        return rem
    },
    createPet: ({ name, species }) => {
        petList.push({ 'name':name, 'species':species })
        return petList[petList.length - 1]
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