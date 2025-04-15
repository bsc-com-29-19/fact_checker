def append_update_to_step(state, step_type, message):
    step = next((s for s in state["steps"] if s["status"] == "pending" and s["type"] == step_type), None)
    if step:
        step.setdefault("updates", []).append(message)