#!/usr/bin/env node

let amqp = require('amqplib/callback_api')
let nodemailer = require('nodemailer')

amqp.connect('amqp://localhost', function(error0, connection) {
  if (error0) {
    throw error0
  }

  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1
    }
    
    let queueApprovedOrders = 'pedidos_aprovados'
    let queueDisapprovedOrders = 'pedidos_reprovados'

    channel.assertQueue(queueApprovedOrders, {
      durable: false
    })

    channel.assertQueue(queueDisapprovedOrders, {
      durable: false
    })

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'youremail@gmail.com',
        pass: 'yourpassaword'
      }
    })
    
    var mailOptions = {
      from: 'mfrom@gmail.com',
      to: 'to@gmail.com',
    }

    channel.prefetch(1)
    channel.consume(queueApprovedOrders, function(msg) {
      setTimeout(() => {
        channel.ack(msg)
        console.log('to consumindo aprovados')
        mailOptions['subject'] = 'Pedido Aprovado'
        mailOptions['text'] = 'Seu pedido foi aprovado'
        transporter.sendMail(mailOptions, function(error, info) {
          if (error) {
            console.log(error)
          } else {
            console.log('Email sent: ' + info.response)
          }
        })
      }, 2000)
    }, {
        noAck: false
    })

    channel.consume(queueDisapprovedOrders, function(msg) {
      setTimeout(() => {
        channel.ack(msg)
        
        mailOptions['subject'] = 'Pedido Reprovado'
        mailOptions['text'] = 'Seu pedido foi reprovado'

        transporter.sendMail(mailOptions, function(error, info) {
          if (error) {
            console.log(error)
          } else {
            console.log('Email sent: ' + info.response)
          }
        })
      }, 2000)
    }, {
        noAck: false
    })
  })
})