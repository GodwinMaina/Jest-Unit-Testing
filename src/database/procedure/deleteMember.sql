CREATE OR ALTER PROCEDURE deleteMember
(
    @member_id VARCHAR(250)
)
AS
BEGIN
    DELETE FROM Members WHERE member_id = @member_id;
END
