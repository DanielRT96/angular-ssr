export class Pokemon {
  id!: number;
  name!: string;

  types?: { type: { name: string } }[];
  stats?: { base_stat: number; stat: { name: string } }[];

  get imageUrl() {
    return `https://rawgit.com/PokeAPI/sprites/master/sprites/pokemon/${this.id}.png`;
  }
}
