const csv = require('csv-parser')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const { v4: uuidv4 } = require('uuid');
const ccgen = require('creditcard-generator');
const fs = require('fs');

// const csvWriter = createCsvWriter({
//     path: '../postgres/data/accounts.csv',
//     header: [
//         {id: 'account_id', title: 'account_id'},
//         {id: 'customer_id', title: 'customer_id'},
//         {id: 'card_number', title: 'card_number'},
//         {id: 'account_type', title: 'account_type'},
//         {id: 'account_tier', title: 'account_tier'},
//         {id: 'account_standing', title: 'account_standing'}
//     ]
// })

const csvWriter = createCsvWriter({
    path: '../node/data/cards.csv',
    header: [
        {id: 'card_number', title: 'card_number'}
    ]
})

// const account_types = ['credit', 'debit'];
// const account_tiers = ['platinum', 'gold', 'silver', 'bronze'];
// const account_standings = ['green', 'yellow', 'red'];
// var customer_ids = []

// fs.createReadStream('../postgres/data/customers.csv')
//     .pipe(csv())
//     .on('data', (row) => {
//         customer_ids.push({
//             account_id: uuidv4(),
//             customer_id: row.customer_id,
//             card_number: ccgen.GenCC().toString().replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, "$1-$2-$3-$4"),
//             account_type: account_types[Math.floor(Math.random() * account_types.length)],
//             account_tier: account_tiers[Math.floor(Math.random() * account_tiers.length)],
//             account_standing: account_standings[Math.floor(Math.random() * account_standings.length)]
//         });
//     })
//     .on('end', () => {
//         console.log('csv file processed and customer ids acquired');
//         csvWriter.writeRecords(customer_ids)
//             .then(() => console.log('wrote the data to new csv'));
//     });

var card_numbers = []

fs.createReadStream('../postgres/data/accounts.csv')
    .pipe(csv())
    .on('data', (row) => {
        card_numbers.push({ card_number: row.card_number });
    })
    .on('end', () => {
        console.log('csv file processed and card numbers acquired');
        csvWriter.writeRecords(card_numbers)
            .then(() => console.log('wrote the data to new csv'));
    });

// account_id, customer_id, card_number, account_type, account_tier, account_standing