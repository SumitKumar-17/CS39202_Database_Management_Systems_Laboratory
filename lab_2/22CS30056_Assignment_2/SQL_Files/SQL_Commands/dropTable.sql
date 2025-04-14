DO $$ 
BEGIN
    EXECUTE (
        SELECT string_agg('DROP TABLE IF EXISTS ' || quote_ident(tablename) || ' CASCADE;', ' ')
        FROM pg_tables
        WHERE schemaname = 'public'
    );
END $$;
-- This command drop all the databse tables
