import express from "express";
import {
  getProducts,
  getCustomers,
  getTransactions,
  getGeography,
  addCustomer,
  deleteCustomer,
  updateCustomer,
} from "../controllers/client.js";

const router = express.Router();

router.get("/products", getProducts);
router.get("/customers", getCustomers);
router.post("/customers", addCustomer);
router.delete("/customers/:id", deleteCustomer);
router.put("/customers/:id", updateCustomer);

router.get("/transactions", getTransactions);
router.get("/geography", getGeography);

export default router;
