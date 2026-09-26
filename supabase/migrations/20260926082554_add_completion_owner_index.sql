create index if not exists completions_habit_owner_idx
on public.habit_completions (habit_id, user_id);
