const app = require('express')()
const PORT = 9000

app.listen(
    PORT, () => console.log(`Server is live at localhost:${PORT}`)
)