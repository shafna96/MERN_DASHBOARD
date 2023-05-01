import React, { useState, useRef, useEffect } from "react";

import { Box, Button, Grid, OutlinedInput, useTheme } from "@mui/material";
import { useCreateCustomerMutation, useGetCustomersQuery } from "state/api";
import { DataGrid } from "@mui/x-data-grid";
import { Header } from "components";

const columns = [
  {
    field: "_id",
    headerName: "ID",
    flex: 1,
  },
  {
    field: "name",
    headerName: "Name",
    flex: 0.5,
  },

  {
    field: "email",
    headerName: "Email",
    flex: 1,
  },
  // {
  //   field: "password",
  //   headerName: "password",
  //   flex: 1,
  // },
  {
    field: "phoneNumber",
    headerName: "Phone Number",
    flex: 0.5,
    renderCell: (params) => {
      return params.value.replace(/^(\d{3})(\d{3})(\d{4})/, "($1)$2-$3");
    },
  },
  {
    field: "country",
    headerName: "Country",
    flex: 0.4,
  },
  {
    field: "occupation",
    headerName: "Occupation",
    flex: 1,
  },
  // {
  //   field: "role",
  //   headerName: "Role",
  //   flex: 0.5,
  // },
];
const Customers = () => {
  const theme = useTheme();
  const { data, isLoading } = useGetCustomersQuery();
  const [createCustomer] = useCreateCustomerMutation(); //, { isLoading: isCreating }
  //const [loading, setLoading] = useState(false);
  // const [error, setError] = useState("");

  const filteredFields = columns.filter((column) => column.field !== "_id");
  const filteredColumns = columns.filter(
    (column) => column.field !== "password"
  );

  const [formFields, setFormFields] = useState(
    filteredFields.reduce((acc, { field }) => ({ ...acc, [field]: "" }), {})
  );

  const formFieldsRef = useRef(formFields);

  useEffect(() => {
    setFormFields(formFieldsRef.current);
  }, []);

  const handleSubmit = async () => {
    try {
      await createCustomer(formFields).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    formFieldsRef.current = { ...formFieldsRef.current, [name]: value };
    setFormFields(formFieldsRef.current);
  };
  return (
    <Box m="1.5rem 2.5rem">
      <Header title="CUSTOMERS" subTitle="List of Customers" />
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
          {filteredFields.map((column) => (
            <Grid key={column.field} item xs={12} sm={4} padding={"5px"}>
              <OutlinedInput
                name={column.field}
                placeholder={column.headerName}
                fullWidth
                value={formFields[column.field]}
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
      <Box
        mt="40px"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.primary.light,
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderTop: "none",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${theme.palette.secondary[200]} !important`,
          },
        }}
      >
        <DataGrid
          loading={isLoading || !data}
          getRowId={(row) => row._id}
          rows={data || []}
          columns={filteredColumns}
        />
      </Box>
    </Box>
  );
};

export default Customers;
