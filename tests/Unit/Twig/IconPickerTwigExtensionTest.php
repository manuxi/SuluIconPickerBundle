<?php

declare(strict_types=1);

namespace Manuxi\SuluIconPickerBundle\Tests\Unit\Twig;

use Manuxi\SuluIconPickerBundle\Pool\BootstrapIconsPool;
use Manuxi\SuluIconPickerBundle\Pool\IconPoolRegistry;
use Manuxi\SuluIconPickerBundle\Twig\IconPickerTwigExtension;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Asset\Packages;
use Symfony\Component\Asset\PathPackage;
use Symfony\Component\Asset\VersionStrategy\EmptyVersionStrategy;
use Twig\Environment;
use Twig\Loader\ArrayLoader;

class IconPickerTwigExtensionTest extends TestCase
{
    private function createExtension(bool $debug = false): IconPickerTwigExtension
    {
        return new IconPickerTwigExtension(
            new IconPoolRegistry([new BootstrapIconsPool()]),
            new Packages(new PathPackage('/', new EmptyVersionStrategy())),
            $debug,
        );
    }

    public function testRendersSpriteReference(): void
    {
        $html = $this->createExtension()->renderIcon(['pool' => 'bootstrap-icons', 'name' => 'calendar-heart'], ['class' => 'me-2']);

        $this->assertSame(
            '<svg class="sulu-icon sulu-icon--bootstrap-icons me-2" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false">'
            . '<use href="/bundles/suluiconpicker/icon-picker/bootstrap-icons/sprite.svg#bootstrap-icons-calendar-heart"></use></svg>',
            $html,
        );
    }

    public function testTitleMakesIconAccessible(): void
    {
        $html = $this->createExtension()->renderIcon('house', ['title' => 'Home "page"', 'size' => 24]);

        $this->assertStringContainsString('role="img" aria-label="Home &quot;page&quot;"', $html);
        $this->assertStringContainsString('width="24" height="24"', $html);
        $this->assertStringNotContainsString('aria-hidden', $html);
    }

    public function testEmptyOrUnknownValueRendersNothing(): void
    {
        $extension = $this->createExtension();

        $this->assertSame('', $extension->renderIcon(null));
        $this->assertSame('', $extension->renderIcon(''));
        $this->assertSame('', $extension->renderIcon('does-not-exist'));
    }

    public function testUnknownIconThrowsInDebug(): void
    {
        $this->expectException(\InvalidArgumentException::class);

        $this->createExtension(true)->renderIcon('does-not-exist');
    }

    public function testFunctionIsRegisteredAndNotEscaped(): void
    {
        $twig = new Environment(new ArrayLoader(['icon' => '{{ sulu_icon(icon) }}']));
        $twig->addExtension($this->createExtension());

        $html = $twig->render('icon', ['icon' => ['pool' => 'bootstrap-icons', 'name' => 'house']]);

        $this->assertStringStartsWith('<svg ', $html);
    }
}
