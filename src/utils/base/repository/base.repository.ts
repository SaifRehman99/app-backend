export interface IGenericRepository<T> {
  findAll(): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  create(entity: T): Promise<T>;
  // update(id: string, entity: T): Promise<T | null>;
  // delete(id: string): Promise<void>;
}
