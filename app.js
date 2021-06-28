const express = require('express');
const app = express();
const PORT = 3000;

// static middleware
app.use(express.static(__dirname + '/public'));

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
