## Micro Serviços com RabbitMQ e NodeJS

Trabalho voltado para validar conhecimentos na aula de **Micro serviços** referente a Pós Graduação **Desenvolvimento Full Stack** na instituição **Eurípedes Soares da Rocha - UNIVEM**

---
## Dependências

### Instalar e executar o RabbitMQ

Passos para instalação manual: https://www.rabbitmq.com/download.html

### Executar com docker

`docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management`

## Comportamento

### /create_orders

Cria pedidos (Tópico `pedidos` no RabbitMQ)

### /check_orders

Aprova e reprova pedidos (Consome eventos do tópico `pedidos`), e gera dois novo tópicos **pedidos aprovados** e **pedidos reprovados**


### /send_emails

Envia e-mails referente a aprovação e reprovação de pedidos (Consome eventos do tópico `pedidos_aprovados` e `pedidos_reprovados`)