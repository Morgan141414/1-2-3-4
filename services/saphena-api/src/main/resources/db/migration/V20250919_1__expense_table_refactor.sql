alter table if exists expense
    rename cost to total_cost;

alter table if exists expense
    add column if not exists expense_list jsonb;