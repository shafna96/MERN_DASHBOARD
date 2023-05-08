import React, { useState, useRef, useEffect } from "react";

import { Box, Button, Modal, useTheme } from "@mui/material";
import {
  useCreateCustomerMutation,
  useDeleteCustomerMutation,
  useEditCustomerMutation,
  useGetCustomersQuery,
} from "state/api";
import { DataGrid } from "@mui/x-data-grid";
import { Header } from "components";
import FormComp from "components/FormComp";

const Customers = () => {
  const theme = useTheme();
  const { data, isLoading } = useGetCustomersQuery();
  const [open, setOpen] = useState(false);
  const [deleteCustomer, { isLoading: isDeleting }] =
    useDeleteCustomerMutation();
  const [createCustomer, { isLoading: isCreating }] =
    useCreateCustomerMutation();
  const [editCustomer, { isLoading: isEditing }] = useEditCustomerMutation();
  const [editFormData, setEditFormData] = useState({});
  // console.log({ ...data });
  // useEffect(() => {
  //   if (data) {
  //     setEditFormData({ ...data });
  //   }
  // }, [data]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleEditClick = (params) => {
    console.log(params.row);
    setEditFormData(params.row);
    setOpen(true);
    // Do something with the row data, such as opening a dialog to edit it
  };
  const handleEditChange = (event, params) => {
    const { name, value } = event.target;

    setEditFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleEditSubmit = async (event, params) => {
    event.preventDefault(); // prevent default form submission behavior
    if (isEditing) {
      return;
    }
    try {
      const updatedCustomer = editFormData;
      await editCustomer({ id: params.row._id, customer: updatedCustomer });
      /* handle success */
      setOpen(false);
    } catch (error) {
      /* handle error */
      console.log(error);
    }
  };

  const handleDeleteClick = async (params) => {
    if (isDeleting) {
      return;
    }
    try {
      await deleteCustomer(params.row._id).unwrap();
      console.log(params.row._id);
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      field: "_id",
      headerName: "#",
      flex: 0.25,
      renderCell: (index) => index.api.getRowIndex(index.row._id) + 1,
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

    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleEditClick(params)}
            >
              Edit
            </Button>
            {/* <Button variant="contained" color="primary" onClick={handleOpen}>
              Edit
            </Button> */}
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "75%",
                  bgcolor: "background.paper",
                  //  border: "2px solid #000",
                  // boxShadow: 24,
                  p: 4,
                }}
              >
                <FormComp
                  edit
                  data={filteredFields}
                  value={editFormData}
                  handleChange={(event) => handleEditChange(event, params)}
                  handleSubmit={(event) => handleEditSubmit(event, params)}
                />
              </Box>
            </Modal>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleDeleteClick(params)}
            >
              Delete
            </Button>
          </Box>
        );
      },
    },
  ];

  const filteredFields = columns.filter(
    (column) => column.field !== "_id" && column.field !== "actions"
  );
  const filteredColumns = columns.filter(
    (column) => column.field !== "password"
  );

  const [formFields, setFormFields] = useState(
    filteredFields.reduce((acc, { field }) => ({ ...acc, [field]: "" }), {})
  );
  const formFieldsRef = useRef(formFields);

  const handleSubmit = async () => {
    if (isCreating) {
      return;
    }
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

      <FormComp
        data={filteredFields}
        value={formFields}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
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
          // checkboxSelection
          // onSelectionModelChange={(itm) => console.log(itm)}
        />
      </Box>
    </Box>
  );
};

export default Customers;
