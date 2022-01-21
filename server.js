// import
const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require('graphql')
// mockDB
const petList = require('./petList.json')

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
    type Query {
        getAbout: About
        getMeal(time: MealTime!): Meal
        getPet(id: Int!): Pet
        allPets: [Pet!]! 
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