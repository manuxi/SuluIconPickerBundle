<?php

declare(strict_types=1);

namespace Manuxi\SuluIconPickerBundle\Twig;

use Manuxi\SuluIconPickerBundle\Pool\IconPoolRegistry;
use Symfony\Component\Asset\Packages;
use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

final class IconPickerTwigExtension extends AbstractExtension
{
    public function __construct(
        private readonly IconPoolRegistry $registry,
        private readonly Packages $packages,
        private readonly bool $debug = false,
    ) {}

    public function getFunctions(): array
    {
        return [
            new TwigFunction('sulu_icon', $this->renderIcon(...), ['is_safe' => ['html']]),
        ];
    }

    /**
     * @param array{class?: string, size?: string|int, title?: string} $options
     */
    public function renderIcon(mixed $value, array $options = []): string
    {
        $icon = $this->registry->createReference($value);
        if (null === $icon) {
            return '';
        }

        if (!$this->registry->isValid($icon)) {
            if ($this->debug) {
                throw new \InvalidArgumentException(\sprintf('Icon "%s" does not exist in pool "%s".', $icon->name, $icon->pool));
            }

            return '';
        }

        $size = (string) ($options['size'] ?? '1em');
        $attributes = [
            'class' => trim('sulu-icon sulu-icon--' . $icon->pool . ' ' . ($options['class'] ?? '')),
            'width' => $size,
            'height' => $size,
            'fill' => 'currentColor',
        ];

        $title = $options['title'] ?? null;
        if (\is_string($title) && '' !== $title) {
            $attributes['role'] = 'img';
            $attributes['aria-label'] = $title;
        } else {
            $attributes['aria-hidden'] = 'true';
            $attributes['focusable'] = 'false';
        }

        $href = $this->packages->getUrl($this->registry->get($icon->pool)->getSpritePath()) . '#' . $icon->getSymbolId();

        return \sprintf('<svg%s><use href="%s"></use></svg>', $this->renderAttributes($attributes), $this->escape($href));
    }

    /**
     * @param array<string, string> $attributes
     */
    private function renderAttributes(array $attributes): string
    {
        $html = '';
        foreach ($attributes as $name => $value) {
            $html .= \sprintf(' %s="%s"', $name, $this->escape($value));
        }

        return $html;
    }

    private function escape(string $value): string
    {
        return htmlspecialchars($value, \ENT_QUOTES | \ENT_SUBSTITUTE, 'UTF-8');
    }
}
