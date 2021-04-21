#!/usr/bin/env node

let amqp = require('amqplib/callback_api')
let count = 0

amqp.connect('amqp://localhost', function(error0, connection) {
  if (error0) {
    throw error0
  }

  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1
    }
    
    let queueOrders = 'pedidos'
    let queueApprovedOrders = 'pedidos_aprovados'
    let queueDisapprovedOrders = 'pedidos_reprovados'

    channel.assertQueue(queueOrders, {
      durable: false
    })

    channel.prefetch(1)
    channel.consume(queueOrders, function(msg) {
      count += 1
      setTimeout(() => {
        channel.ack(msg)
        if(count > 2 && count % 2 == 0) {
          channel.assertQueue(queueApprovedOrders, { durable: false })
          setInterval(() => {  
            console.log('to aqui aprovado')
            channel.sendToQueue(queueApprovedOrders, Buffer.from(JSON.stringify(msg.content.toString())))
            console.log(" [x] Sent %s", msg) 
          }, 100)
        } else {
          channel.assertQueue(queueDisapprovedOrders, { durable: false })
          setInterval(() => { 
            channel.sendToQueue(queueDisapprovedOrders, Buffer.from(JSON.stringify(msg.content.toString())))
            console.log(" [x] Sent %s", msg) 
          }, 100)
        } 
      }, 2000)
    }, {
        noAck: false
    })
  })
})