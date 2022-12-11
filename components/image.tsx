import type { BCMSMediaParsed } from '@becomes/cms-client/types';
import type { BCMSMostImageProcessorProcessOptions } from '@becomes/cms-most/types';
import {
  BCMSImageConfig,
  createBcmsImageHandler,
} from '@becomes/cms-most/frontend';
import {
  CSSProperties,
  onBeforeUpdate,
  onMounted,
  onUnmounted,
  PropType,
  ref,
} from 'vue';

export const BCMSImage = defineNuxtComponent({
  props: {
    media: {
      type: Object as PropType<BCMSMediaParsed>,
      required: true,
    },
    class: String,
    style: Object as PropType<string | CSSProperties>,
    id: String,
    options: Object as PropType<BCMSMostImageProcessorProcessOptions>,
    svg: Boolean,
  },
  setup(props) {
    const handler = createBcmsImageHandler(props.media, props.options);
    const container = ref<HTMLDivElement | null>();
    const srcSet = ref(handler.getSrcSet());
    let mediaBuffer = '';
    let optionsBuffer = '';

    function resizeHandler() {
      if (container.value) {
        const el = container.value;
        srcSet.value = handler.getSrcSet({ width: el.offsetWidth });
      }
    }

    onMounted(() => {
      mediaBuffer = JSON.stringify(props.media);
      optionsBuffer = props.options ? JSON.stringify(props.options) : '';
      resizeHandler();
      window.addEventListener('resize', resizeHandler);
    });

    onBeforeUpdate(() => {
      let resize = false;
      if (mediaBuffer !== JSON.stringify(props.media)) {
        mediaBuffer = JSON.stringify(props.media);
        resize = true;
      }
      if (!props.options && optionsBuffer) {
        optionsBuffer = '';
        resize = true;
      } else if (
        props.options &&
        optionsBuffer !== JSON.stringify(props.options)
      ) {
        optionsBuffer = JSON.stringify(props.options);
        resize = true;
      }
      if (resize) {
        resizeHandler();
      }
    });

    onUnmounted(() => {
      window.addEventListener('resize', resizeHandler);
    });

    return () => (
      <div
        id={props.id}
        class={`bcmsImage ${props.class || ''}`}
        style={props.style}
        ref={container}
        data-bcms-img-w={srcSet.value[2]}
        data-bcms-img-h={srcSet.value[3]}
        data-bcms-img-src={props.media.src}
        data-bcms-img-ops={handler.optionString}
        data-bcms-img-idx={srcSet.value[4]}
      >
        <>
          {handler.parsable ? (
            <picture>
              <source srcset={srcSet.value[0]} />
              <source srcset={srcSet.value[1]} />
              <img
                data-bcms-image={handler.optionString + ';' + props.media.src}
                src={
                  BCMSImageConfig.localeImageProcessing
                    ? '/bcms-media' + props.media.src
                    : srcSet.value[1]
                }
                alt={props.media.alt_text}
                width={srcSet.value[2]}
                height={srcSet.value[3]}
              />
            </picture>
          ) : props.svg && props.media.svg ? (
            <div v-html={props.media.svg} />
          ) : (
            <img
              src={srcSet.value[1]}
              alt={props.media.alt_text}
              width={props.media.width}
              height={props.media.height}
            />
          )}
        </>
      </div>
    );
  },
});
