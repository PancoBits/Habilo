export class Card{
    constructor(id,name,description,due,priority,tags,stats,isFinished,type){
        this.id = id;
        this.name = name;
        this.description = description;
        this.due = due;
        this.priority = priority;
        this.tags = tags;
        this.stats = stats;
        this.isFinished = isFinished;
        this.type = type;
    }

    set finished(isFinished){
        this.isFinished = isFinished;
    }
}