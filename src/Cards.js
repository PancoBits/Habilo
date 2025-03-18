export class Cards {
  awards;
  constructor(
    id,
    name,
    description,
    due,
    priority,
    tags,
    stats,
    isFinished,
    type,
    position,
    color
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.due = due;
    this.priority = priority;
    this.tags = tags;
    this.stats = stats;
    this.isFinished = isFinished;
    this.type = type;
    this.position = position;
    this.color = color;
  }

  set setfinished(isFinished) {
    this.isFinished = isFinished;
  }
  set setposition(position) {
    this.position = position;
  }
  set setcolor(color) {
    this.color = color;
  }

  cloneWithChanges(changes) {
    return Object.assign(new Cards(), this, changes);
  }
}
