import { ApolloProvider } from "@apollo/client";
import { gql, useQuery } from "@apollo/client";
import { ApolloClient, FetchResult, InMemoryCache } from "@apollo/client/core";
import { Box, Grid, Paper, Stack } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useRef, useState } from "react";

const get_books = gql`
  query {
    booksByTitle(title: "b") {
      author
    }
  }
`;
const calculate = gql`
  mutation ($arr: Arr1) {
    calculate(arr: $arr)
  }
`;

function App() {
  const [arr1, setArr1] = useState<number[]>([]);
  const [arr2, setArr2] = useState<number[]>([]);
  const ref = useRef<HTMLInputElement>(null);
  const [data, setData] = useState("");
  // const Arr = { arr1: [2, 200, 100], arr2: [50, 4, 100] };
  const Arr = { arr1: arr1, arr2: arr2 };

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: "http://localhost:4000/graphql",
  });

  const handleCalculate = () => {
    console.log(ref.current?.value);

    const resp = client.mutate({
      mutation: calculate,
      variables: { arr: Arr },
    });
    console.log(resp);
    resp.then((d) => setData(d?.data?.calculate.join(", ")));
  };

  return (
    <ApolloProvider client={client}>
      <Grid container sx={{ justifyContent: "center" }}>
        <Grid item xs={4}>
          <Paper sx={{ padding: 5 }} elevation={6}>
            <Stack direction="column" spacing={3}>
              <TextField inputRef={ref} variant="outlined" />
              <TextField
                variant="outlined"
                value={arr1}
                onChange={(e) =>
                  setArr1(e.target.value.split(",").map((e) => Number(e)))
                }
              />
              <TextField
                variant="outlined"
                value={arr2}
                onChange={(e) =>
                  setArr2(e.target.value.split(",").map((e) => Number(e)))
                }
              />
              {data && <div>{data}</div>}
              <Button
                variant="contained"
                size="small"
                onClick={handleCalculate}
              >
                Calculate
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </ApolloProvider>
  );
}

export default App;
