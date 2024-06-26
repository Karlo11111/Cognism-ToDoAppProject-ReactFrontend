export interface Todo {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  labels: string[];
  reminder: string;
}

export interface Label {
  id: string;
  name: string;
  color?: string;
}
