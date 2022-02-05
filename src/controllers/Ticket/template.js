module.exports = (data) => {
return `
<html>
    <head>
        <style>
            table {
                margin: auto;
            }
            img, div{
                width: 300px;
                margin: 1rem auto;
            }
            tr, td {
                padding: 1rem;
            }
            .right {
                text-align: right;

                padding-left: 3rem;
            }
        </style>
    </head>
    <body>
        <div class="logo">
            <img src="${process.env.SERVER_URL}/busbox.png" alt="BusBox">
        </div>
        <table>
            ${
                data.map(item => {
                    return (
                        `
                            <tr>
                                <td>${item.key} </td>
                                <td class="right">${item.value} </td>
                            </tr>
                        `
                    )
                }).join('')
            }
        </table>        
    </body>
</html>
`


{/* <style>            
.details-card{
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    justify-content: center;
    -webkit-box-pack: center;
    width: 500px;
    margin: auto;
}
.detail{
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    display: -webkit-flex;
    display: flex;
    justify-content: space-between;
    -webkit-justify-content:space-between
}
.logo{
    width: fit-content;
    height: fit-content;
    margin: 32px auto;
}
img{
    width: 300px;
}
</style> */}
}