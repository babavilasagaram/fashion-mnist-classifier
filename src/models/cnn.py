import torch.nn as nn


class CNNModel(nn.Module):

    def __init__(self, dropout=0.32884733296309454):
        super().__init__()

        self.features = nn.Sequential(

            nn.Conv2d(
                in_channels=1,
                out_channels=32,
                kernel_size=3,
                padding="same"
            ),
            nn.ReLU(),
            nn.BatchNorm2d(32),
            nn.MaxPool2d(
                kernel_size=2,
                stride=2
            ),

            nn.Conv2d(
                in_channels=32,
                out_channels=64,
                kernel_size=3,
                padding="same"
            ),
            nn.ReLU(),
            nn.BatchNorm2d(64),
            nn.MaxPool2d(
                kernel_size=2,
                stride=2
            )
        )

        self.classifier = nn.Sequential(

            nn.Flatten(),

            nn.Linear(64 * 7 * 7, 128),
            nn.ReLU(),
            nn.Dropout(dropout),

            nn.Linear(128, 64),
            nn.ReLU(),
            nn.Dropout(dropout),

            nn.Linear(64, 10)
        )

    def forward(self, x):

        x = self.features(x)
        x = self.classifier(x)

        return x