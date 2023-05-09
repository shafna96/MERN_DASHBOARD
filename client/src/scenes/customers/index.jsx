import React, { useState, useRef } from "react";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Modal,
  Slide,
  useTheme,
} from "@mui/material";
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
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [createCustomer, { isLoading: isCreating }] =
    useCreateCustomerMutation();
  const [deleteCustomer, { isLoading: isDeleting }] =
    useDeleteCustomerMutation();
  const [editCustomer, { isLoading: isEditing }] = useEditCustomerMutation();
  const [editFormData, setEditFormData] = useState({});
  const [deletingRow, setDeletingRow] = useState(null);

  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
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
        const handleEditClose = () => {
          setEditOpen(false);
        };

        const handleDeleteClose = () => {
          setDeleteOpen(false);
        };

        const handleEditClick = (params) => {
          console.log(params.row);
          setEditFormData(params.row);
          setEditOpen(true);
        };
        const handleEditChange = (event) => {
          const { name, value } = event.target;
          setEditFormData((prevState) => ({
            ...prevState,
            [name]: value,
          }));
        };
        const handleEditSubmit = async (event) => {
          event.preventDefault();
          if (isEditing) {
            return;
          }
          try {
            const updatedCustomer = editFormData;
            await editCustomer({
              id: editFormData._id,
              customer: updatedCustomer,
            });
            setEditOpen(false);
            console.log(editFormData);
          } catch (error) {
            console.log(error);
          }
        };

        const handleDeleteClick = (params) => {
          setDeletingRow(params.row);
          console.log(params.row);
          setDeleteOpen(true);
        };
        const handleDeleteSubmit = async (event) => {
          event.preventDefault();
          if (isDeleting) {
            return;
          }
          try {
            await deleteCustomer(deletingRow._id).unwrap();
            console.log(deletingRow._id);
            setDeletingRow(null);
            setDeleteOpen(false);
          } catch (error) {
            console.log(error);
          }
        };
        return (
          <Box>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleEditClick(params)}
            >
              Edit
            </Button>
            <Modal
              open={editOpen}
              onClose={handleEditClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <FormComp
                  edit
                  data={filteredFields}
                  value={editFormData}
                  handleChange={(event) => handleEditChange(event)}
                  handleSubmit={(event) => handleEditSubmit(event)}
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
            <Modal
              open={deleteOpen && deletingRow?._id === params.row._id}
              onClose={handleDeleteClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <Dialog
                  open={deleteOpen}
                  TransitionComponent={Transition}
                  keepMounted
                  onClose={handleDeleteClose}
                  aria-describedby="alert-dialog-slide-description"
                >
                  <DialogTitle>{"Confirm delete"}</DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                      Do you really want to delete this record? This process
                      cannot be undone
                      <br />
                      <strong>{`name: ${params.row.name}`}</strong>
                      <br />
                      <strong>{`email: ${params.row.email}`}</strong>
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleDeleteClose}>Cancel</Button>
                    <Button onClick={(event) => handleDeleteSubmit(event)}>
                      Delete
                    </Button>
                  </DialogActions>
                </Dialog>
              </Box>
            </Modal>
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

  const handleChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    formFieldsRef.current = { ...formFieldsRef.current, [name]: value };
    setFormFields(formFieldsRef.current);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isCreating) {
      return;
    }
    try {
      await createCustomer(formFields).unwrap();
      setFormFields(
        filteredFields.reduce((acc, { field }) => ({ ...acc, [field]: "" }), {})
      );
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Box m="1.5rem 2.5rem">
      <Header title="CUSTOMERS" subTitle="List of Customers" />
      {isCreating && <>data creating</>}
      <FormComp
        data={filteredFields}
        value={formFields}
        handleChange={(event) => handleChange(event)}
        handleSubmit={(event) => handleSubmit(event)}
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
        />
      </Box>
    </Box>
  );
};

export default Customers;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "75%",
  bgcolor: "background.paper",
  p: 4,
};
