# Database Migrations

This directory contains database migration scripts. To apply migrations:

1. For local development:

```bash
python -m alembic upgrade head
```

2. For production:

- Migrations are applied automatically during deployment
- Never run init_db.py in production
- Always use migrations for schema changes

## Creating a new migration

1. Make your model changes in the code
2. Generate a new migration:

```bash
alembic revision --autogenerate -m "description of changes"
```

3. Review the generated migration file
4. Test the migration locally
5. Commit and push the changes

## Important Notes

- Never run init_db.py in production
- Always backup the database before applying migrations
- Test migrations thoroughly in a staging environment
- Keep track of all migrations in version control
