// code.tsx
const { widget } = figma;
const { AutoLayout, Text, useSyncedState, useEffect, Image } = widget;

const logoImage = `data:image/png;base64,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`;

function PhotoFrameWidget() {
  // Use synced state to store the note text
  const [imageURL, setImageURL] = useSyncedState("imageURL", "");

  useEffect(() => {
    figma.ui.onmessage = (msg) => {
      if (msg.type === "image") {
        setImageURL(msg.data);
        figma.closePlugin();
      }
    };
  }, []);

  const handleCheckInput = async () => {
    await new Promise((resolve) => {
      figma.showUI(__html__, { height: 480, width: 300 });
    });
  };
  return (
    <AutoLayout
      direction="vertical"
      fill={"#FFFFFF"}
      padding={!imageURL ? 32 : 0}
      spacing={16}
      cornerRadius={!imageURL ? 20 : 0}
      stroke={"#E6E6E6"}
      strokeWidth={!imageURL ? 1 : 0}
    >
      {!imageURL ? (
        <AutoLayout direction="vertical" spacing={16}>
          <Image src={logoImage} height={80} width={80} />
          <Text fontWeight="semi-bold" fontSize={18}>
            Photo Frame
          </Text>
          <Text>Upload photo from your{`\n`}device to add frame.</Text>
          <AutoLayout
            verticalAlignItems={"center"}
            spacing={8}
            padding={16}
            cornerRadius={8}
            fill={"#FFFFFF"}
            stroke={"#E6E6E6"}
            onClick={() => handleCheckInput()}
            hoverStyle={{
              fill: "#000000",
            }}
          >
            <Text
              fill="#000000"
              hoverStyle={{
                fill: "#FFFFFF",
              }}
            >
              Upload Photo
            </Text>
          </AutoLayout>
        </AutoLayout>
      ) : (
        <Image
          // Pass a data uri directly as the image
          src={imageURL}
        />
      )}
    </AutoLayout>
  );
}

widget.register(PhotoFrameWidget);
