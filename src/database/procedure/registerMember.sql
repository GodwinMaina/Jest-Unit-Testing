CREATE OR ALTER PROCEDURE registerMember

   ( @member_id VARCHAR(250),
    @cohort_no VARCHAR(250),
     @firstName VARCHAR(250),
     @lastName VARCHAR(250),
     @email VARCHAR(250),
     @password VARCHAR(250)
    )
AS
BEGIN
    INSERT INTO Members(member_id,cohort_no,firstName, lastName, email, password)
    VALUES (@member_id, @cohort_no,@firstName, @lastName, @email, @password)
END


