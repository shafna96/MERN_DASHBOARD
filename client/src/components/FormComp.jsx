import { Box, Button, Grid, OutlinedInput, useTheme } from "@mui/material";
import React from "react";

const FormComp = ({ handleSubmit, data, handleChange, value }) => {
  const theme = useTheme();

  return (
    <form onSubmit={handleSubmit}>
      <Grid
        container
        rowGap={1}
        sx={{
          padding: "25px",
          marginTop: "40px",
          backgroundColor: theme.palette.primary.light,
        }}
      >
        {data.map((column) => (
          <Grid key={column.field} item xs={12} sm={4} padding={"5px"}>
            <OutlinedInput
              name={column.field}
              placeholder={column.headerName}
              fullWidth
              value={value[column.field]}
              onChange={handleChange}
            />
          </Grid>
        ))}
        <Grid item xs={12}>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"flex-end"}
          >
            <Button
              variant="contained"
              color="secondary"
              size="large"
              sx={{ width: "18%" }}
              type="submit"
              // onSubmit={handleSubmit}
            >
              ADD
            </Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  );
};

export default FormComp;
