# pixi-svelte

Use PixiJS in a declarative way with Svelte5.

## Documentation

Check out the github repo for pixi-svelte usage and for more information in https://github.com/StakeEngine/web-sdk/tree/main/packages/pixi-svelte

For more usage please checkout storybook: https://github.com/StakeEngine/web-sdk/tree/main/packages/pixi-svelte-storybook

## Examples of usage

### Text

```ts
<script lang="ts">
    import { createApp, setContextApp, App, Text } from "pixi-svelte";
    const context = createApp();
    setContextApp(context);
</script>

<App>
    <Text value="Hello world!" style={{ fill: 0xff1010 }} />
</App>
```

### Graphics

```ts
<script lang="ts">
    import { createApp, setContextApp, App, Graphics } from "pixi-svelte";
    const context = createApp();
    setContextApp(context);
</script>

<App>
    <Graphics
    	draw={(graphics) => {
    		graphics.beginFill(0xde3249);
    		graphics.drawRect(0, 0, 150, 150);
    		graphics.endFill();
    	}}
    />

</App>
```

### Rectangle

```ts
<script lang="ts">
    import { createApp, setContextApp, App, Rectangle } from "pixi-svelte";
    const context = createApp();
    setContextApp(context);
</script>

<App>
    <Rectangle
    	width={100}
    	height={100}
    	alpha={1}
    	borderWidth={2}
    	backgroundColor={0x522000}
    	borderColor={0x1dc000}
    	borderRadius={0.5}
    	x={50}
    	y={50}
    	zIndex={1}
    	isMask={false}
    />
</App>
```

## SSR

"window" is required for this package, so if SvelteKit is used, there is an option to make it work:

- Turn off SSR

```ts
// src/routes/+layout.ts
export const ssr = false;
```

## Reference

- Pixi Text: https://pixijs.download/dev/docs/PIXI.Text.html
- Pixi Graphics Example: https://pixijs.io/examples-v4/#/graphics/simple.js
- SvelteKit SSR: https://kit.svelte.dev/docs/page-options#ssr
- Create a SvelteKit app: https://kit.svelte.dev/docs/creating-a-project
