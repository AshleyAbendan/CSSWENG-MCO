const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
const { getDb } = require('./db');
const { v4: uuidv4 } = require('uuid');

// Route for the index page
router.get('/', (req, res) => {
  res.render('index', { title: 'Home' });  // Render the index.hbs template
});

//Route for the Admin page
router.get('/admin', (req, res) => {
  res.render('admin', { title: 'Admin' });  // Render the admin.hbs template
});

//Route for the Order Form page
router.get('/orderform', (req, res) => {
  res.render('orderform', { title: 'OrderForm' });  // Render the admin.hbs template
});

//Route for the Create New Client page
router.get('/createclient', (req, res) => {
  res.render('createclient', { title: 'CreateClient' });  // Render the admin.hbs template
});

// Route for the About Us page
router.get('/about-us', (req, res) => {
  res.render('about_us', { title: 'About Us' });  // Render the about_us.hbs template
});

// Route for the Catering Menu Page
router.get('/catering-menu', async (req, res) => {
  try {
      const db = getDb();
      const menuItems = await db.collection('menuItems').find({}).toArray(); 
      const beefItems = menuItems.filter(item => item.category === 'Beef');
      const porkItems = menuItems.filter(item => item.category === 'Pork');
      const chickenItems = menuItems.filter(item => item.category === 'Chicken');
      const seafoodItems = menuItems.filter(item => item.category === 'Fish/Seafood');
      const vegetableItems = menuItems.filter(item => item.category === 'Vegetable');
      const pastaItems = menuItems.filter(item => item.category === 'Pasta/Noodles');
      
      res.render('catering_menu', {
          title: 'Catering Menu',
          beefItems,
          porkItems,
          chickenItems,
          seafoodItems,
          vegetableItems,
          pastaItems
      });
  } catch (error) {
      console.error('Error retrieving menu items:', error);
      res.status(500).send('Internal Server Error');
  }
});

// Route for the FAQs
router.get('/faqs', (req, res) => {
  res.render('faqs', { title: 'FAQs' });  // Render the catering_menu.hbs template
});

// Route for the Contact page
router.get('/contact', (req, res) => {
  console.log('Success flag:', req.query.success);
  res.render('contact', { title: 'Contact Us', success: req.query.success, error: req.query.error });  // Render the contact.hbs template with success and error flags
});

// POST route for the Contact page form submission
router.post('/contact', async (req, res) => {
  const { firstName, lastName, email, phone, facebook, subject, message } = req.body;

  if (!firstName || !lastName || !email || !phone) {
    return res.status(400).send('First name, last name, email, and phone are required.');
  }

  try {
    const db = getDb();
    let contactsId;

    // Check if email already exists in the contacts collection
    const existingContact = await db.collection('contacts').findOne({ email });
    if (existingContact) {
      console.log('Email already exists in database:', email);
      contactsId = existingContact._id;
    } else {
      // Insert into contacts collection
      const contactResult = await db.collection('contacts').insertOne({
        firstName,
        lastName,
        email,
        phone,
        facebook,
        timestamp: new Date()
      });
      console.log('Contact data inserted:', contactResult);
      contactsId = contactResult.insertedId;
    }

    // Check if there is an existing event with the same email and status 'Pending'
    const existingEvent = await db.collection('events').findOne({ contactsId: contactsId, status: 'Pending' });
    if (existingEvent) {
      console.log('Event already pending for this email:', email);
      return res.redirect(`/contact?error=Event already pending for this email: ${email}`);
    }

    // Insert into events collection with default values
    const eventResult = await db.collection('events').insertOne({
      eventId: uuidv4(),
      contactsId: contactsId,
      venue: 'N/A',
      address: 'N/A',
      occasion: 'N/A',
      event_date: 'N/A',
      time_start: 'N/A',
      time_end: 'N/A',
      number_pax: 'N/A',
      table_linen: 'N/A',
      table_napkin: 'N/A',
      welcome_food1: 'N/A',
      welcome_food2: 'N/A',
      welcome_food3: 'N/A',
      appetizer1: 'N/A',
      appetizer2: 'N/A',
      appetizer3: 'N/A',
      main_course1: 'N/A',
      main_course2: 'N/A',
      main_course3: 'N/A',
      main_course4: 'N/A',
      main_course5: 'N/A',
      main_course6: 'N/A',
      main_course7: 'N/A',
      dessert1: 'N/A',
      dessert2: 'N/A',
      dessert3: 'N/A',
      drink1: 'N/A',
      drink2: 'N/A',
      drink3: 'N/A',
      notes: 'N/A',
      special_instructions: 'N/A',
      contract_price: 'N/A',
      downpayment: 'N/A',
      status: 'Pending'
    });

    console.log('Event data inserted:', eventResult);

    // Insert into messages collection with reference to the contact
    const messageResult = await db.collection('messages').insertOne({
      contactsId: contactsId,
      subject,
      message,
      timestamp: new Date()
    });
    console.log('Message data inserted:', messageResult);

  } catch (dbError) {
    console.error('Error inserting data into the database:', dbError);
    return res.status(500).send('Error inserting data into the database');
  }

  try {
    // Create a transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'mailerdeflorence@gmail.com', // Your Gmail email address
        pass: 'nayf cfiv cpff bmxs'   // Your Gmail password
      }
    });

    // Fallback to "N/A" if Facebook link is not provided
    const facebookLink = facebook || 'N/A';

    // Email options
    const mailOptions = {
      from: 'noreply@example.com',
      to: 'xendraketv@gmail.com', // Set the recipient email here
      subject: subject || 'New Booking', // Use provided subject or default
      text: `Name: ${firstName} ${lastName}
Email: ${email}
Phone: ${phone}
Facebook: ${facebookLink}
Subject: ${subject}
Message: ${message}`,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);

    res.redirect('/contact?success=true'); // Redirect with success message
  } catch (emailError) {
    console.error('Error sending email:', emailError);
    return res.status(500).send('Error sending email');
  }
});

// Route for the Packages Wedding page
router.get('/packages/wedding', (req, res) => {
  res.render('packages_wedding', { title: 'Wedding Package' });  // Render the about_us.hbs template
});

// Route for the Packages Milestone page
router.get('/packages/milestone', (req, res) => {
  res.render('packages_milestone', { title: 'Milestone Package' });  // Render the about_us.hbs template
});

// Route for the Packages All-In page
router.get('/packages/all-in', (req, res) => {
  res.render('packages_all-in', { title: 'All-In Package' });  // Render the about_us.hbs template
});


// Route for the Packages Station page
router.get('/packages/stations', (req, res) => {
  res.render('packages_stations', { title: 'Stations' });  // Render the about_us.hbs template
});
module.exports = router;
