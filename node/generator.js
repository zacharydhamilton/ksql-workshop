require('dotenv').config();
const pg = require('pg');
const csv = require('csv-parser');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

class Generator {
    constructor() {
        this.cards = this.get_cards();
        this.pool = new pg.Pool();
        this.pool.on('error', (err, client) => {
            console.error('Unexpected error on idle client', err)
            process.exit(-1)
        });
        this.start(this.cards);
    }
    get_cards = () => {
        return new Promise((resolve, reject) => {
            const cards = []
            fs.createReadStream('data/cards.csv')
                .pipe(csv())
                .on('data', (row) => {
                    cards.push(row.card_number);
                })
                .on('error', (error) => {
                    reject(error);
                })
                .on('end', () => {
                    resolve(cards);
                })
        })   
    }
    start = (cards) => {
        setInterval(() => {
            cards.then(values => {
                this.pool.connect((err, client, done) => {
                    const shouldAbort = err => {
                        if (err) {
                            console.error('Error in transaction:', err.stack)
                            client.query('ROLLBACK', err => {
                                if (err) {
                                    console.error('Error rolling back client:', err.stack);
                                }
                                done();
                            }) 
                        }
                        return !!err;
                    }
                    client.query('BEGIN', (err, res) => {
                        if (shouldAbort(err)) return;
                        const transaction = {
                            id: uuidv4(),
                            card: values[Math.floor(Math.random() * values.length)],
                            amount: Math.floor(Math.random() * 25000)
                        }
                        const query = `
                        INSERT INTO bank.transactions (transaction_id, card_number, transaction_amount)
                        VALUES ('${transaction.id}', '${transaction.card}', ${transaction.amount})
                        `;
                        client.query(query, (err, res) => {
                            if (shouldAbort(err)) return;
                            client.query('COMMIT', (err, res) => {
                                if (err) {
                                    console.err('Error committing transaction:', err.stack);
                                }
                                done();
                            })
                        })
                    })
                })
            })
            .catch(err => {
                console.error(err);
            })
        }, 1000);
    }
}
const gen = new Generator();