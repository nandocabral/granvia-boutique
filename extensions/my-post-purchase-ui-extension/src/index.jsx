/**
 * Extend Shopify Checkout with a custom Post Purchase user experience.
 * This template provides two extension points:
 *
 *  1. ShouldRender - Called first, during the checkout process, when the
 *     payment page loads.
 *  2. Render - If requested by `ShouldRender`, will be rendered after checkout
 *     completes
 */
import React, { useEffect, useState } from "react";
import {
  extend,
  render,
  BlockStack,
  Button,
  Banner,
  Radio,
  Layout,
  useExtensionInput,
  View,
  Select,
} from "@shopify/post-purchase-ui-extensions-react";
import { BOUTIQUES } from "./utils";

/**
 * Entry point for the `ShouldRender` Extension Point.
 *
 * Returns a value indicating whether or not to render a PostPurchase step, and
 * optionally allows data to be stored on the client for use in the `Render`
 * extension point.
 */
extend("Checkout::PostPurchase::ShouldRender", async ({ storage }) => {
  const initialState = await getRenderData();
  await storage.update(initialState);
  return {
    render: true,
  };
});

// Simulate results of network call, etc.
async function getRenderData() {
  return {
    couldBe: "anything",
  };
}

/**
 * Entry point for the `Render` Extension Point
 *
 * Returns markup composed of remote UI components.  The Render extension can
 * optionally make use of data stored during `ShouldRender` extension point to
 * expedite time-to-first-meaningful-paint.
 */
render("Checkout::PostPurchase::Render", () => <App />);

// Top-level React component
export function App() {
  const { storage, inputData, calculateChangeset, applyChangeset, done } =
    useExtensionInput();
  console.log(storage);
  const [ciudad, setCiudad] = useState("");
  const [boutique, setBoutique] = useState("");
  const [boutiquesSelected, setBoutiquestSelected] = useState([]);

  useEffect(() => {
    const [filtered] = BOUTIQUES.filter(({ value }) => value === ciudad);
    if (filtered && Array.isArray(filtered?.children)) {
      setBoutiquestSelected(filtered.children);
      setBoutique("");
    }
  }, [ciudad]);

  async function onBoutiqueChange(value) {
    setBoutique(value);
    // const result = await editNote({
    //   type: "updateNote",
    //   note: `Boutique: ${value}`,
    // });
    // if (result.type === "success") {
    //   setShowToast(true);
    // }
  }

  return (
    <BlockStack spacing="loose">
      <Layout
        maxInlineSize={0.95}
        media={[
          { viewportSize: "small", sizes: [1, 30, 1] },
          { viewportSize: "medium", sizes: [500, 30, 0.3] },
          { viewportSize: "large", sizes: [500, 30, 0.3] },
        ]}
      >
        <View blockPadding="base">
          <Banner
            status="info"
            title="Para resolver cualquier duda o sugerencia, selecciona tu boutique más cercana."
            blockPadding="base"
          />
          <View padding="base" alignment="center" blockPadding="base">
            <Select
              label="Selecciona la ciudad"
              value={ciudad}
              options={[
                {
                  value: "zapopan",
                  label: "Zapopan",
                },
                {
                  value: "guadalajara",
                  label: "Guadalajara",
                },
                {
                  value: "cdmx",
                  label: "CDMX",
                },
                {
                  value: "puerto_cancun",
                  label: "Puerto Cancún",
                },
                {
                  value: "culiacan",
                  label: "Culiacán",
                },
              ]}
              onChange={(value) => setCiudad(value)}
            />
          </View>
          <View padding="base" blockPadding="loose">
            {/* Content */}
            {boutiquesSelected.map((obj, i) => (
              <View blockPadding="base">
                <Radio
                  id={`${obj.name} - ${obj.direction}`}
                  key={`${obj.name}_${i}_check`}
                  name="boutique"
                  onChange={() => onBoutiqueChange(obj)}
                >
                  {`${obj.name} - ${obj.direction}`}
                </Radio>
              </View>
            ))}
          </View>
        </View>
      </Layout>
    </BlockStack>
  );
}
