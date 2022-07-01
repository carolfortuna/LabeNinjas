import React from "react";
import axios from "axios";


import Filter from "../Filter/Filter";
import { Card } from "./styled";
import { CardContainer, Div } from "./styled";
import { getAllJobs } from "../../services/ConexoesApi";
import { addToCart } from "../../services/ConexoesApi";
import { removeFromCart } from "../../services/ConexoesApi";

export default class CardServico extends React.Component {
  state = {
    servicos: [],
    minValue: "",
    maxValue: "",
    searchProd: "",
    order: "Título"
  };

  componentDidMount = () => {
    getAllJobs(this.saveJobs);
  };

  saveJobs = (data) => {
    this.setState({ servicos: data });
  };

  onChangeMinValue = (e) => {
    this.setState({ minValue: e.target.value });
  };
  onChangeMaxValue = (e) => {
    this.setState({ maxValue: e.target.value });
  };
  onChangeSearchProd = (e) => {
    this.setState({ searchProd: e.target.value });
  };
  onChangeOrder = (e) => {
    this.setState({ order: e.target.value });
  };

  adicionarAoCarrinho = (id) => {
    addToCart(id);
  };
  removerDoCarrinho = (id) => {
    removeFromCart(id);
  };

  render() {
    const filteredJobs = this.state.servicos
      .filter((job) => {
        let minVal = this.state.minValue ? this.state.minValue : -Infinity;
        let maxVal = this.state.maxValue ? this.state.maxValue : Infinity;
        let search = this.state.searchProd.toLowerCase();
        let title = job.title.toLowerCase();
        return (
          job.price >= minVal && job.price <= maxVal && title.includes(search)
        );
      })
      .sort((a, b) => {
        switch (this.state.order) {
          case "Título":
            return a.title.localeCompare(b.title);
          case "Prazo":
            return a.dueDate.localeCompare(b.dueDate);
          case "Decrescente":
            return b.price - a.price;
          case "Crescente":
            return a.price - b.price;
          default:
            return a.price - b.price;
        }
      });

    const servicos = filteredJobs.map((servico) => {
      let today = new Date(servico.dueDate);
      const dd = String(today.getDate()).padStart(2, "0");
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const yyyy = today.getFullYear();

      today = dd + "/" + mm + "/" + yyyy;

      return (
        <Card key={servico.id}>
          <p>{servico.title}</p>
          <p>
            Prazo: {today}, Preço: R${servico.price}
          </p>
          <div>
            <button
              onClick={() => {
                this.removerDoCarrinho(servico.id);
              }}
            >
              Detalhes
            </button>
            <button
              onClick={() => {
                this.adicionarAoCarrinho(servico.id);
              }}
              disabled={servico.taken}
            >
              Adicionar
            </button>
          </div>
        </Card>
      );
    });
    return (
      <div>
        <Div>
        <Filter
          minValue={this.state.minValue}
          maxValue={this.state.maxValue}
          searchProd={this.state.searchProd}
          order={this.state.order}
          onChangeMinValue={this.onChangeMinValue}
          onChangeMaxValue={this.onChangeMaxValue}
          onChangeSearchProd={this.onChangeSearchProd}
          onChangeOrder={this.onChangeOrder}
        />
        </Div>
        <CardContainer>{servicos}</CardContainer>
      </div>
    );
  }
}