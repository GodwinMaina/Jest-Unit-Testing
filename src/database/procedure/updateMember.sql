CREATE OR ALTER PROCEDURE UpdateUser
(
    @member_id VARCHAR(250),
    @cohort_no VARCHAR(250),
    @firstName VARCHAR(250),
    @lastName VARCHAR(250),
    @email VARCHAR(250),
    @password VARCHAR(250)
)
AS
BEGIN
    UPDATE Members 
    SET 
        cohort_no = @cohort_no,
        firstName = @firstName,
        lastName = @lastName, 
        email = @email,
        password = @password
    WHERE  
        member_id = @member_id;
END
