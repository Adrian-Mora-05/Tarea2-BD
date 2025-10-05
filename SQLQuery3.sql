
CREATE PROCEDURE sp_ListarEmpleados
    @Filtro NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        -- Si el filtro est� vac�o o son solo espacios, listar todos los empleados
        IF @Filtro IS NULL OR LTRIM(RTRIM(@Filtro)) = ''
        BEGIN
            SELECT 
                e.Id,
                e.ValorDocumentoIdentidad,
                e.Nombre,
                p.Nombre AS NombrePuesto,
                p.SalarioxHora,
                e.FechaContratacion,
                e.SaldoVacaciones,
                e.EsActivo
            FROM Empleado e
            INNER JOIN Puesto p ON e.IdPuesto = p.Id
            WHERE e.EsActivo = 1  -- Solo empleados activos
            ORDER BY e.Nombre ASC;
        END
        -- Si el filtro contiene solo n�meros, buscar por ValorDocumentoIdentidad
        ELSE IF @Filtro NOT LIKE '%[^0-9]%'  -- Solo contiene d�gitos
        BEGIN
            SELECT 
                e.Id,
                e.ValorDocumentoIdentidad,
                e.Nombre,
                p.Nombre AS NombrePuesto,
                p.SalarioxHora,
                e.FechaContratacion,
                e.SaldoVacaciones,
                e.EsActivo
            FROM Empleado e
            INNER JOIN Puesto p ON e.IdPuesto = p.Id
            WHERE e.EsActivo = 1 
            AND e.ValorDocumentoIdentidad LIKE '%' + @Filtro + '%'
            ORDER BY e.Nombre ASC;
        END
        -- Si el filtro contiene letras y/o espacios, buscar por Nombre
        ELSE
        BEGIN
            SELECT 
                e.Id,
                e.ValorDocumentoIdentidad,
                e.Nombre,
                p.Nombre AS NombrePuesto,
                p.SalarioxHora,
                e.FechaContratacion,
                e.SaldoVacaciones,
                e.EsActivo
            FROM Empleado e
            INNER JOIN Puesto p ON e.IdPuesto = p.Id
            WHERE e.EsActivo = 1 
            AND e.Nombre LIKE '%' + @Filtro + '%'
            ORDER BY e.Nombre ASC;
        END
    END TRY
    BEGIN CATCH
        -- En caso de error, retornar c�digo de error
        DECLARE @ErrorCode INT = 50000; -- C�digo para error de base de datos
        THROW;
    END CATCH
END