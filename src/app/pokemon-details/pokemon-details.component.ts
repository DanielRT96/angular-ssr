import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { Pokemon } from '../pokemon';
import { PokemonService } from '../pokemon.service';

@Component({
  selector: 'app-pokemon-details',
  templateUrl: './pokemon-details.component.html',
  styleUrls: ['./pokemon-details.component.scss'],
})
export class PokemonDetailsComponent implements OnInit {
  pokemon!: Pokemon;

  constructor(
    private pokemonService: PokemonService,
    private router: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.router.paramMap
      .pipe(
        map((params) => Number(params.get('id'))),
        switchMap((id) => {
          return this.pokemonService.getPokemonDetails(id);
        })
      )
      .subscribe((pokemon) => (this.pokemon = pokemon));
  }
}
