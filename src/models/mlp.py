import torch.nn as nn


class MLPModel(nn.Module):

    def __init__(
        self,
        input_dim=784,
        output_dim=10,
        num_hidden_layers=3,
        neurons_per_layer=128,
        dropout_rate=0.3
    ):
        super().__init__()

        layers = []

        for _ in range(num_hidden_layers):

            layers.append(
                nn.Linear(
                    input_dim,
                    neurons_per_layer
                )
            )

            layers.append(
                nn.BatchNorm1d(neurons_per_layer)
            )

            layers.append(
                nn.ReLU()
            )

            layers.append(
                nn.Dropout(dropout_rate)
            )

            input_dim = neurons_per_layer

        layers.append(
            nn.Linear(
                neurons_per_layer,
                output_dim
            )
        )

        self.model = nn.Sequential(*layers)

    def forward(self, x):
        return self.model(x)
        