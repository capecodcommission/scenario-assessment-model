const _ = require('lodash')

module.exports = {
  all: [
    {
      id: 1,
      username: 'admin',
      password: 'password',
      name: 'Vue Master',
    },
    {
      id: 2,
      username: 'user1',
      password: 'password',
      name: 'User One',
    },
    {
      id: 3,
      username: 'mcarloni',
      password: 'password',
      name: 'Mario',
      addtlProps: {
        age: 30,
        otherThings: {
          scenarios: [
            {
              id: 2879,
              treatments: [
                {
                  id: 2948,
                  name: 'Fertilizer Management',
                  nitrogenRemovedKG: 1140,
                },
                {
                  id: 2949,
                  name: 'Permeable Reactive Barriers',
                  nitrogenRemovedKG: 578,
                },
              ],
            },
            {
              id: 2880,
              treatments: [
                {
                  id: 2950,
                  name: 'Urine Diverting Toilets',
                  nitrogenRemovedKG: 2850,
                },
                {
                  id: 2951,
                  name: 'Aquaculture Above Estuary Bed',
                  nitrogenRemovedKG: 3780,
                },
              ],
            },
          ],
        },
      },
    },
    {
      id: 4,
      username: 'sgoulet',
      password: 'password',
      name: 'Shawn',
    },
  ].map(user => {
    return {
      ...user,
      token: `valid-token-for-${user.username}`,
    }
  }),
  authenticate({ username, password }) {
    return new Promise((resolve, reject) => {
      const matchedUser = this.all.find(
        user => user.username === username && user.password === password
      )
      if (matchedUser) {
        resolve(this.json(matchedUser))
      } else {
        reject(new Error('Invalid user credentials.'))
      }
    })
  },
  findBy(propertyName, value) {
    const matchedUser = this.all.find(user => user[propertyName] === value)
    return this.json(matchedUser)
  },
  json(user) {
    return user && _.omit(user, ['password'])
  },
}
