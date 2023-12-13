/**
 * Address Interface.
 */
export interface Address {
  readonly cep: string;
  readonly logradouro: string;
  readonly bairro: string;
  readonly localidade: string;
  readonly uf: string;
  readonly ibge: string;
  readonly ddd: string;
}
