const express = require("express");
const axios = require("axios");
const app = express();

const port = 9876;
const window_size = 10;
const time = 500;
let window = [];

const APIS = {
  p: "http://20.244.56.144/test/primes",
  f: "http://20.244.56.144/test/fibo",
  e: "http://20.244.56.144/test/even",
  r: "http://20.244.56.144/test/random",
};

const fetchingFromAPI = async (n) => {
  try {
    const response = await axios.get(APIS[n], {
      timeout: time,
      headers: {
        Authorization: Bearer`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzE3MDc2ODE4LCJpYXQiOjE3MTcwNzY1MTgsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjNjNGFjNDI1LWJhYTQtNDhkZS05ZGYxLTUyNTNhNTNiOTZkZSIsInN1YiI6InJhbWF2YXRoLm5hbmRpbmkwMDI2QGdtYWlsLmNvbSJ9LCJjb21wYW55TmFtZSI6Iktlc2hhdiBNZW1vcmlhbCBJbnN0aXR1ZSBvZiBUZWNobm9sb2d5IiwiY2xpZW50SUQiOiIzYzRhYzQyNS1iYWE0LTQ4ZGUtOWRmMS01MjUzYTUzYjk2ZGUiLCJjbGllbnRTZWNyZXQiOiJ5Z2FzanZNdHNkSmVOenZEIiwib3duZXJOYW1lIjoiIFJhbWF2YXQgTmFuZGluaSIsIm93bmVyRW1haWwiOiJyYW1hdmF0aC5uYW5kaW5pMDAyNkBnbWFpbC5jb20iLCJyb2xsTm8iOiIyMUJEMUE2NzUxIn0.oNXFCRz5FS4orAzqu9TPealeRYui2PkNyAfQ1WAxtJU`,
      },
    });
    return response.data.numbers || [];
  } catch (error) {
    console.error("Error fetching numbers:", error.message);
    return [];
  }
};

app.get("/numbers/:id", async (req, res) => {
  const { id } = req.params;

  if (!APIS[id]) {
    return res.status(400).json({ error: "Invalid number ID" });
  }

  const nums = await fetchingFromAPI(id);
  console.log();
  let windowPrevState = [...window];

  nums.forEach((num) => {
    if (!window.includes(num)) {
      if (window.length >= window_size) {
        window.shift();
      }
      window.push(num);
    }
  });

  let sum = 0;
  for (let i = 0; i < window.length; i++) {
    sum += window[i];
  }
  const average = window.length > 0 ? sum / window.length : 0;

  res.json({
    windowPrevState,
    windowCurrState: window,
    numbers: nums,
    average: average.toFixed(2),
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
