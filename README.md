![BusBox Logo](src/icons/busbox.png)

BusBox is the simple bus ticket booking application. It gives you a nice and user-friendly platform to book your bus tickets for your journeys in India. Along with ticket booking BusBox also gives you a way to track all your journeys and ability to cancel your tickets as per your needs.

# Table of Contents

1. [Demo](#demo)
2. [Installation](#installation)
3. [Technology Stack](#technology-stack)
4. [API Reference](#api-reference)
5. [Author](#author)
6. [License](#license)

## Demo
[Live Demo](http://patilgajanan.com)

Please Note:

- On stripe dashboard you can use test card (4242 4242 4242 4242) with future expiry date and any 3 digit cvv to make a successful booking.
- We only have buses for these cities for now </br>
Banglore ,Kolar, Vellore, Tirupati, Nellore, Ongole, Guntur, Vijayawada, Kakinada, Visakhapatna, Srikakulam, Ichchapuram, Brahmapur, Khordha, Bhubaneswar.

## Installation

Clone the project

```bash
  git clone https://github.com/pesto-students/busbox-be-n12-gamma2.git
```

Go to the project directory

```bash
  cd busbox-be-n12-gamma2
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```

Please Note : 
To run this project, you will need to add the following environment variables to your .env file

`ACCESS_TOKEN_SECRET`

`REFRESH_TOKEN_SECRET`

`DATABASE_URI`

`STRIPE_SECRETE_API_KEY`

`SERVER_URL`

`FRONTEND_URL`

`NODE_MAILER_EMAIL`

`NODE_MAILER_PASSWORD`

`GOOGLE_CLIENT_ID`


## Technology Stack

- Node JS
- Express JS
- Redis
- Mongo DB


## API Reference

You can find detailed documentation and information of each and every API this server provides in [API-DOCS](API-DOCS.pdf) file in this repo. 


##  Author
My name is [Gajanan Patil](https://github.com/patilgajanan1807). I'm a full stack developer. I am always eager to learn new things, or have peer coding session, or to just chill with other dev buddies.
Feel free to contact me on my [Linked In](). Or drop me an [email](patilgajanan1807@gmail.com)

## License

[MIT](https://opensource.org/licenses/MIT)
