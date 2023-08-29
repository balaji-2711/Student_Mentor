var express = require("express");
var router = express.Router();
const { dbUrl, mongodb, MongoClient } = require("../config/dbConfig");

//it gives all the students data
router.get("/all-students", async function (req, res) {
  const client = await MongoClient.connect(dbUrl);
  try {
    const db = client.db("Student_Mentor");
    const user = await db.collection("student").find().toArray();
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.json({ message: "Error Occurred in DB" });
  } finally {
    client.close();
  }
});

//it gives all the mentor data
router.get("/all-mentors", async (req, res) => {
  const client = await MongoClient.connect(dbUrl);
  try {
    const db = client.db("Student_Mentor");
    const user = await db.collection("mentor").find().toArray();
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.json({ message: "Error Occurred in DB" });
  } finally {
    client.close();
  }
});

//add-mentor
router.post("/add-mentor", async (req, res) => {
  const client = await MongoClient.connect(dbUrl);
  try {
    const db = client.db("Student_Mentor");
    const user = await db.collection("mentor").insertOne(req.body); //creating mentor in mentor collection
    if (req.body.mentorStudent) {
      //if mentor exist we have to update the mentor db
      req.body.mentorStudent.map(async (e) => {
        const stud = await db
          .collection("student")
          .updateOne(
            { studentName: e },
            { $set: { studentMentor: req.body.mentorName } }
          );
      });
    }
    res.status(200).json({
      message: "Mentor Added Successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//add student
router.post("/add-student", async (req, res) => {
  const client = await MongoClient.connect(dbUrl); //to connect be with database
  try {
    const db = client.db("Student_Mentor"); //database name reuse panradhuku
    const user = await db.collection("student").insertOne(req.body); //insert student in student collection
    if (req.body.studentMentor) {
      //if mentor exist we have to update the mentor db
      const men = await db
        .collection("mentor")
        .findOne({ mentorName: req.body.studentMentor }); //adding the student to the mentor
      men.mentorStudent.push(req.body.studentName); //pushing the new student to mentor array
      const update = await db.collection("mentor").updateOne(
        { mentorName: req.body.studentMentor },
        { $set: { mentorStudent: men.mentorStudent } } //for update
      );
    }
    res.status(200).json({
      message: "Student Added Successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  } finally {
    client.close();
  }
});

//assign students to a mentor
router.post("/assign-students", async (req, res) => {
  //First update mentor array by adding students with existing students
  const client = await MongoClient.connect(dbUrl);
  try {
    const db = await client.db("Student_Mentor");
    const men = await db
      .collection("mentor")
      .findOne({ mentorName: req.body.mentorName });
    req.body.mentorStudent.map(async (e) => {
      men.mentorStudent.push(e); //updating the students in mentor object
      const user = await db
        .collection("student")
        .updateOne(
          { studentName: e },
          { $set: { studentMentor: req.body.mentorName } }
        ); //updating mentor name for individual student
    });
    const result = await db
      .collection("mentor")
      .updateOne(
        { mentorName: req.body.mentorName },
        { $set: { mentorStudent: men.mentorStudent } }
      ); //updating the modified object to db

    res.status(200).json({
      message: "Assigned Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Error Occurred in DB",
    });
  } finally {
    client.close();
  }
});

router.post("/change-mentor", async (req, res) => {
  try {
    const client = await MongoClient.connect(dbUrl);
    const db = await client.db("Student_Mentor");

    //1 getting the student with old_mentor
    const stud = await db
      .collection("student")
      .findOne({ studentName: req.body.studentName });

    //2 getting the newMentor details from mentor collection
    const men = await db
      .collection("mentor")
      .findOne({ mentorName: req.body.newMentor });
    men.mentorStudent.push(req.body.studentName);

    //3 updating the student name in changed mentor document
    var result = await db
      .collection("mentor")
      .updateOne(
        { mentorName: req.body.newMentor },
        { $set: { mentorStudent: men.mentorStudent } }
      );

    //4 removing the old student from mentor collection
    const oldMen = await db
      .collection("mentor")
      .findOne({ mentorName: stud.studentMentor });
    oldMen.mentorStudent.splice(
      oldMen.mentorStudent.indexOf(req.body.studentName),
      1
    );

    //5 delete
    result = await db
      .collection("mentor")
      .updateOne(
        { mentorName: stud.studentMentor },
        { $set: { mentorStudent: oldMen.mentorStudent } }
      );

    //6 updating the student with new mentor
    const user = await db
      .collection("student")
      .updateOne(
        { studentName: req.body.studentName },
        { $set: { studentMentor: req.body.newMentor } }
      );
    res.status(200).json({
      message: "Mentor Re-Assigned",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Error occurred in DB",
    });
  } finally {
    client.close();
  }
});

//getting the mentor details of a particular student
router.get("/mentor", async (req, res) => {
  const client = await MongoClient.connect(dbUrl);
  try {
    const db = client.db("Student_Mentor");
    const user = await db
      .collection("student")
      .findOne({ studentName: req.body.studentName });
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.json({ message: "Error Occurred in DB" });
  } finally {
    client.close();
  }
});

//getting the students details of a particular mentor
router.get("/students", async (req, res) => {
  const client = await MongoClient.connect(dbUrl);
  try {
    const db = client.db("Student_Mentor");
    const user = await db
      .collection("mentor")
      .findOne({ mentorName: req.body.mentorName });
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.json({ message: "Error Occurred in DB" });
  } finally {
    client.close();
  }
});

module.exports = router;
