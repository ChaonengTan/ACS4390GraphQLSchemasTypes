// import
const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require('graphql')

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
    type Query {
        getAbout: About
        getMeal(time: MealTime!): Meal
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