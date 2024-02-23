
CREATE TABLE Members(
member_id VARCHAR(250) UNIQUE NOT NULL,    
cohort_no VARCHAR(250) ,
firstName VARCHAR(250) ,
lastName VARCHAR(250) ,
email VARCHAR(250) ,
password VARCHAR(250) 
  
)

SELECT *FROM Members

DROP TABLE Members