// code.tsx
const { widget } = figma;
const { AutoLayout, Text, useSyncedState, useEffect, useWidgetId, Image } =
  widget;

function PhotoFrameWidget() {
  // Use synced state to store the note text
  const [imageURL, setImageURL] = useSyncedState("imageURL", "");
  const widgetId = useWidgetId();

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
    <AutoLayout direction="vertical" fill={"#FFFFFF"} padding={16} spacing={16}>
      {!imageURL ? (
        <AutoLayout direction="vertical" spacing={16}>
          <Text>Upload Photo from your devices.</Text>
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
