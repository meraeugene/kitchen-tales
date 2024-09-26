import asyncHandler from "../middlewares/asyncHandler";
import Contact from "../models/contactModel";
import { Request, Response } from "express";

// @desc Get all orders
// @route GET /api/contacts
// @access Private/Admin
const getContacts = asyncHandler(async (req: Request, res: Response) => {
  try {
    const pageSize = 15;
    const page = Number(req.query.pageNumber) || 1;

    const count = await Contact.countDocuments();

    const contacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.status(200).json({
      contacts,
      page,
      pages: Math.ceil(count / pageSize),
      count,
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// @desc Create a contact
// @route POST /api/contacts/
// @access Public
const createContact = asyncHandler(async (req: Request, res: Response) => {
  try {
    let { name, email, message } = req.body;

    name = name.trim();

    if (!name && !email && !message) {
      res.status(404).json({
        message: "Contact Submission Failed. Input fields are empty.",
      });
      return;
    }

    if (!name) {
      res.status(404).json({
        message: "Contact Submission Failed. Please input your name.",
      });
      return;
    }

    if (!email) {
      res.status(404).json({
        message: "Contact Submission Failed. Please input your email.",
      });
      return;
    }

    if (!message) {
      res.status(404).json({
        message: "Contact Submission Failed. Please input a message.",
      });
      return;
    }

    const newContact = new Contact({
      name,
      email,
      message,
    });

    await newContact.save();

    res.status(201).json({ message: "Submitted Successfully" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// @desc Delete a contact by ID
// @route DELETE /api/contacts/:id
// @access Private/Admin
const deleteContactById = asyncHandler(async (req: Request, res: Response) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (contact) {
      await Contact.deleteOne({ _id: req.params.id });
      res.status(200).json({ message: "Contact  deleted successfully" });
    } else {
      res.status(404).json({ message: "Contact not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

export { getContacts, createContact, deleteContactById };
