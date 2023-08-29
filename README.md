# Student_Mentor_Mgt

Hi Welcome to my Student_Mentor_Mgt Task.

I have deployed this task in Render.
https://student-mentor-mgt.onrender.com

1. To get all the student details use the get request in https://student-mentor-mgt.onrender.com/all-students

2. To get the all mentor Details use the get request in https://student-mentor-mgt.onrender.com/all-mentors
 
3. To add a new mentor use the post request in https://student-mentor-mgt.onrender.com/add-mentor

   Sample request for Creating API:
    {
    "mentorName" : "Raju",
    "mentorStudent" : ["Anu"]
    }
    
 4. To add a new student use the post request in https://student-mentor-mgt.onrender.com/add-student
    
    Sample request for Creating API:
    {
    "studentName":"Gayathri"
    }
    
 5. To assign new student to existing mentor use the post request in https://student-mentor-mgt.onrender.com/assign-students
    
    Sample request for Creating API:
    {
    "mentorName" : "Raju",
    "mentorStudent": ["Gayathri"]
     }
    
 6. To change mentor of a student use the post request in https://student-mentor-mgt.onrender.com/change-mentor
     
    //note: the new mentor name should be in the mentor collection
    
    Sample request for Creating API:
    {
    "studentName":"Anu",
    "newMentor":"Kumar"
    } 
    
 7. To get the mentor details of a particular student use the get request in https://student-mentor-mgt.onrender.com/mentor
    
    Sample request for Creating API:
    {
    "studentName":"Gayathri"
    } 
    
 8. To get the student details of a particular mentor use the get request in https://student-mentor-mgt.onrender.com/students
   
    Sample request for Creating API:
    {
    "mentorName":"Raju"
    } 




