<?php

declare(strict_types=1);

namespace Manuxi\SuluIconPickerBundle\Tests\Unit\Content\Type;

use Manuxi\SuluIconPickerBundle\Content\Type\IconPickerPropertyResolver;
use Manuxi\SuluIconPickerBundle\Pool\BootstrapIconsPool;
use Manuxi\SuluIconPickerBundle\Pool\IconPoolRegistry;
use PHPUnit\Framework\TestCase;

class IconPickerPropertyResolverTest extends TestCase
{
    private IconPickerPropertyResolver $resolver;

    protected function setUp(): void
    {
        $this->resolver = new IconPickerPropertyResolver(new IconPoolRegistry([new BootstrapIconsPool()]));
    }

    public function testType(): void
    {
        $this->assertSame('icon_picker', IconPickerPropertyResolver::getType());
    }

    public function testResolvesStoredValue(): void
    {
        $view = $this->resolver->resolve(['pool' => 'bootstrap-icons', 'name' => 'house'], 'de');

        $this->assertSame(['pool' => 'bootstrap-icons', 'name' => 'house'], $view->getContent());
    }

    public function testUnknownIconResolvesToNull(): void
    {
        $this->assertNull($this->resolver->resolve(['pool' => 'bootstrap-icons', 'name' => 'does-not-exist'], 'de')->getContent());
        $this->assertNull($this->resolver->resolve(['pool' => 'tabler', 'name' => 'house'], 'de')->getContent());
        $this->assertNull($this->resolver->resolve(null, 'de')->getContent());
    }
}
